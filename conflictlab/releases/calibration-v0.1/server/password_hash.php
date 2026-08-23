<?php
declare(strict_types=1);

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

$hash = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = (string)($_POST['password'] ?? '');

    if (strlen($password) >= 12) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
    }
}
?>
<!doctype html>
<html lang="lt">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex,nofollow">
<title>Admin password hash</title>
</head>
<body>
<h2>ConflictLab admin slaptažodis</h2>

<form method="post">
    <input
        type="password"
        name="password"
        minlength="12"
        required
        autocomplete="new-password"
        placeholder="Naujas admin slaptažodis"
    >
    <button type="submit">Generuoti hash</button>
</form>

<?php if ($hash): ?>
    <p>Nukopijuok tik šį hash:</p>
    <textarea rows="4" cols="80" readonly><?=htmlspecialchars($hash)?></textarea>
<?php endif; ?>

</body>
</html>