<?php
declare(strict_types=1);
// SDC310L Week 3: session-owned carts and prepared MySQL operations.
ini_set('display_errors', '0');
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off']);
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_THROW_ON_ERROR);
    exit;
}
function integer($value, int $min, int $max): int {
    if (!is_int($value) || $value < $min || $value > $max) {
        throw new InvalidArgumentException('Use a whole-number quantity between 0 and 999.');
    }
    return $value;
}
function cents(string $price): int {
    $parts = explode('.', $price);
    return (int)$parts[0] * 100 + (int)str_pad($parts[1] ?? '', 2, '0');
}
function currentState(PDO $pdo): array {
    $products = $pdo->query('SELECT ProductId, ProductName, Description, Price, Unit, StockQuantity, ImageFile FROM Products ORDER BY ProductId')->fetchAll();
    $products = array_map(static function ($p) {
        return ['id' => (int)$p['ProductId'], 'name' => $p['ProductName'], 'description' => $p['Description'],
            'unitPriceCents' => cents($p['Price']), 'unit' => $p['Unit'], 'stock' => (int)$p['StockQuantity'], 'imageFile' => $p['ImageFile']];
    }, $products);
    $items = [];
    if (isset($_SESSION['cart_id'])) {
        $q = $pdo->prepare('SELECT ProductId, Quantity FROM CartItems WHERE CartId = ? ORDER BY ProductId');
        $q->execute([$_SESSION['cart_id']]);
        foreach ($q->fetchAll() as $row) $items[(int)$row['ProductId']] = (int)$row['Quantity'];
    }
    $subtotal = 0;
    foreach ($products as $p) $subtotal += $p['unitPriceCents'] * ($items[$p['id']] ?? 0);
    $tax = (int)round($subtotal * 0.05, 0, PHP_ROUND_HALF_UP);
    $shipping = (int)round($subtotal * 0.10, 0, PHP_ROUND_HALF_UP);
    return ['products' => $products, 'quantities' => (object)$items, 'csrfToken' => $_SESSION['csrf'],
        'totals' => ['subtotal' => $subtotal, 'tax' => $tax, 'shipping' => $shipping, 'total' => $subtotal + $tax + $shipping]];
}

$pdo = null;
$previousCart = $_SESSION['cart_id'] ?? null;
try {
    require __DIR__ . '/db.php';
    if (!isset($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET') respond(currentState($pdo));
    if ($method !== 'POST') {
        header('Allow: GET, POST');
        respond(['error' => 'Method not allowed.'], 405);
    }
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) respond(['error' => 'Send JSON data.'], 415);
    $body = json_decode(file_get_contents('php://input'), true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($body)) throw new InvalidArgumentException('Invalid request.');
    if (!is_string($body['csrfToken'] ?? null) || !hash_equals($_SESSION['csrf'], $body['csrfToken'])) respond(['error' => 'Refresh the page before changing your cart.'], 403);
    $action = $body['action'] ?? '';
    if (!in_array($action, ['add', 'update', 'remove', 'checkout'], true)) throw new InvalidArgumentException('Unknown cart action.');
    $pdo->beginTransaction();
    if ($action === 'checkout') {
        if ($previousCart !== null) {
            // Course checkout clears this session's cart; no payment is collected.
            $q = $pdo->prepare('DELETE FROM CartItems WHERE CartId = ?');
            $q->execute([$previousCart]);
        }
    } else {
        $productId = integer($body['productId'] ?? null, 1, PHP_INT_MAX);
        $q = $pdo->prepare('SELECT StockQuantity FROM Products WHERE ProductId = ? FOR UPDATE');
        $q->execute([$productId]);
        $product = $q->fetch();
        if (!$product) throw new InvalidArgumentException('Product not found.');
        $quantity = $action === 'remove' ? 0 : integer($body['quantity'] ?? null, $action === 'add' ? 1 : 0, 999);
        $cartId = $previousCart;
        if ($cartId === null && $quantity > 0) {
            $pdo->exec('INSERT INTO Carts () VALUES ()');
            $cartId = (int)$pdo->lastInsertId();
            $_SESSION['cart_id'] = $cartId;
        }
        if ($cartId !== null) {
            $q = $pdo->prepare('SELECT Quantity FROM CartItems WHERE CartId = ? AND ProductId = ? FOR UPDATE');
            $q->execute([$cartId, $productId]);
            $old = $q->fetchColumn();
            if ($action === 'add') $quantity += $old === false ? 0 : (int)$old;
            if ($quantity > min(999, (int)$product['StockQuantity'])) throw new InvalidArgumentException('That quantity exceeds the available stock.');
            if ($quantity === 0) {
                $q = $pdo->prepare('DELETE FROM CartItems WHERE CartId = ? AND ProductId = ?');
                $q->execute([$cartId, $productId]);
            } elseif ($old === false) {
                $q = $pdo->prepare('INSERT INTO CartItems (CartId, ProductId, Quantity) VALUES (?, ?, ?)');
                $q->execute([$cartId, $productId, $quantity]);
            } else {
                $q = $pdo->prepare('UPDATE CartItems SET Quantity = ? WHERE CartId = ? AND ProductId = ?');
                $q->execute([$quantity, $cartId, $productId]);
            }
        }
    }
    $pdo->commit();
    respond(currentState($pdo));
} catch (Throwable $e) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    if ($previousCart === null) unset($_SESSION['cart_id']);
    if ($e instanceof InvalidArgumentException || $e instanceof JsonException) respond(['error' => $e->getMessage()], 400);
    error_log('FromTheFarm database error: ' . $e->getMessage());
    respond(['error' => 'The shop database is unavailable. Start MySQL and import FromTheFarm.sql, then retry.'], 503);
}
