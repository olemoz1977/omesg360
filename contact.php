
<?php
$to = 'info@omesg360.eu'; // Jūsų gavėjas
function sanitize($str){ return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name    = sanitize($_POST['name'] ?? '');
  $email   = sanitize($_POST['email'] ?? '');
  $company = sanitize($_POST['company'] ?? '');
  $message = sanitize($_POST['message'] ?? '');

  if (!$name || !$email || !$message) {
    http_response_code(400);
    echo 'Klaida: privalomi laukai.';
    exit;
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Klaida: el. pašto formatas.';
    exit;
  }

  $subject = 'Nauja žinutė iš OM ESG360';
  $body  = "Vardas: {$name}\r\n";
  $body .= "El. paštas: {$email}\r\n";
  $body .= "Įmonė: {$company}\r\n\r\n";
  $body .= "Žinutė:\r\n{$message}\r\n";

  // Siuntimo nustatymai
  $fromEmail = 'no-reply@omesg360.eu'; // siuntėjas iš jūsų domeno
  $headers  = "From: OM ESG360 <{$fromEmail}>\r\n";
  $headers .= "Reply-To: {$email}\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
  $headers .= "Return-Path: {$fromEmail}\r\n";

  // Envelope sender (pagerina pristatymą)
  $params = "-f {$fromEmail}";

  // 1) Laiškas jums
  $sent = mail($to, $subject, $body, $headers, $params);

  if ($sent) {
    // 2) Patvirtinimo laiškas interesantui
    $confirmSubject = 'Ačiū – Jūsų užklausa gauta (OMESG360)';
    $confirmBody  = "Sveiki, {$name},\r\n\r\n";
    $confirmBody .= "Ačiū už žinutę! Gavau Jūsų užklausą ir atsakysiu per 1–2 darbo dienas.\r\n";
    $confirmBody .= "Jūsų pateikta informacija:\r\n";
    $confirmBody .= "- El. paštas: {$email}\r\n";
    $confirmBody .= "- Įmonė: {$company}\r\n\r\n";
    $confirmBody .= "Jei skubu – rašykite tiesiogiai: info@omesg360.eu\r\n\r\n";
    $confirmBody .= "Su pagarba,\r\nOMESG360";

    $confirmHeaders  = "From: OMESG360 <{$fromEmail}>\r\n";
    $confirmHeaders .= "Reply-To: {$fromEmail}\r\n";
    $confirmHeaders .= "MIME-Version: 1.0\r\n";
    $confirmHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $confirmHeaders .= "Return-Path: {$fromEmail}\r\n";

    // envelope sender
    @mail($email, $confirmSubject, $confirmBody, $confirmHeaders, $params);

    echo 'Ačiū! Jūsų žinutė išsiųsta.';
    exit;
  } else {
    http_response_code(500);
    echo 'Nepavyko išsiųsti. Parašykite: info@omesg360.eu';
    exit;
  }
} else {
  http_response_code(405);
  echo 'Neteisingas metodas.';
  exit;
}
