<?php

session_start();

//JSON受信 
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

//email/password取り出し 
$email = $data["email"];
$password = $data["password"];

//DB接続
$dbn = "mysql:dbname=linguadiary;host=localhost;charset=utf8mb4";
$pdo = new PDO($dbn, "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);


//emailでSELECT → ユーザー存在確認 
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");

$stmt -> execute([":email" => $email]);

$user = $stmt -> fetch(PDO::FETCH_OBJ);

//正しければ $_SESSION["user_id"] にID保存,success返却
if (password_verify($password, $user->password_hash)) {
  $_SESSION["user_id"] = $user->id;
  echo (json_encode(["success" => true]));
} else {
  echo (json_encode(["success" => false]));
}









?>