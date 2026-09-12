<?php

session_start();//セッションへの保存処理開始

$raw = file_get_contents("php://input");//JSON受信
$data = json_decode($raw);//json文字列をPHPで読める形式へ


/*==========================
=====バリデーション処理======
============================*/

//必要なデータをいれた変数がなかった場合
if (!isset(
  $data->username,
  $data->email,
  $data->password)) {

  echo json_encode([
    "success" => false,
    "message" => "Required fields are missing."
    ]);
  exit;

  //存在確認が出来れば、各値を取り出して変数に言える
} else {
  //username / email / password を取り出す
  $username = trim($data->username);
  $email = trim($data->email);
  $password = $data->password;
  //パスワードを password_hash(
  $passwordHash = password_hash($password, PASSWORD_DEFAULT);
}

//データが空だった場合
if (empty($username) || empty($email) || empty($password)) {
  echo json_encode([
    "success" => false,
    "message" => "Please fill in all required fields."
    ]);
  exit;
}

//正規表現//

//username の長さ→ 3〜20文字くらいにする
if (!(strlen($username) >= 3 && strlen($username) <= 20)) {
  echo json_encode([
    "success" => false,
    "message" => "Username must be between 3 and 20 characters."
    ]);
  exit;
}

//email の形式→ filter_var(..., FILTER_VALIDATE_EMAIL)
if (!(filter_var($email, FILTER_VALIDATE_EMAIL))) {
  echo json_encode([
    "success" => false,
    "message" => "Please enter a valid email address."
  ]);
  exit;
}

//password の長さ→ 8文字以上
if (!(strlen($data->password) >= 8)) {
  echo json_encode([
    "success" => false,
    "message" => "Password must be at least 8 characters long."
    ]);
  exit;
} 

//password の内容→ preg_match() で英字や数字を含むか
$patternStr = "/[a-zA-Z]/";
$patternInt = "/[0-9]/";
$patternPermission = "/^[a-zA-Z0-9_]+$/";

if (!preg_match($patternPermission, $password)) {
  echo json_encode([
    "success" => false,
    "message" => "Password can only contain letters, numbers, and underscores (_)."
    ]);
  exit;
}

if (!preg_match($patternStr, $password)) {
  echo json_encode([
    "success" => false,
    "message" => "Password must include at least one letter."
    ]);
  exit;
}

if (!preg_match($patternInt, $password)) {
  echo json_encode([
    "success" => false,
    "message" => "Password must include at least one number."
    ]);
  exit;
}


/*=======================
=====データベース接続=====
=========================*/

$dbn = "mysql:dbname=linguadiary;host=localhost;charset=utf8mb4";


//DB接続
try {
  $pdo = new PDO (
    $dbn, "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );

  //メールアドレスの重複チェック
  $checkStmt = $pdo->prepare (
    "SELECT * FROM  users WHERE email = :email"
  );

  $checkStmt->execute([":email" => $email]);  

  if ($checkStmt->fetch(PDO::FETCH_OBJ)) {
    echo json_encode([
      "success" => false,
      "message" => "This email address is already registered."
      ]);
    exit;
  }



  //users テーブルへINSERT
  $stmt = $pdo->prepare (
    "INSERT INTO users (username, email, password_hash) 
      VALUES (:username, :email, :passwordHash)"
  );

  $stmt->execute([
      ":username" => $username,
      ":email" => $email,
      ":passwordHash" => $passwordHash
  ]);

  $stmt->fetch(PDO::FETCH_OBJ);

  $userId = $pdo->lastInsertId();//新しく作ったユーザーIDを取得  

  $_SESSION["user_id"] = $userId;//$_SESSION["user_id"] にそのIDを保存

  echo json_encode(["success" => true]);//success: true をJSONで返す

} catch (PDOException $e) {
  echo $e -> getMessage();
  exit;
}








?>