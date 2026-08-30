<?php

session_start();//セッションへの保存処理開始

$raw = file_get_contents("php://input");//JSON受信
$data = json_decode($raw);//json文字列をPHPで読める形式へ

//username / email / password を取り出す
$userName = $data -> username;
$email = $data -> email;
$password = $data -> password;
//パスワードを password_hash(
$passwordHash = password_hash($password, PASSWORD_DEFAULT);


//DB接続
$dbn = "mysql:dbname=linguadiary;host=localhost;charset=utf8mb4";

try {
  $pdo = new PDO (
    $dbn, "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );


  //users テーブルへINSERT
  $stmt = $pdo->prepare(
    "INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :passwordHash)"
  );

  $stmt->execute([
      ":username" => $userName,
      ":email" => $email,
      ":passwordHash" => $passwordHash
  ]);

  $userId = $pdo->lastInsertId();//新しく作ったユーザーIDを取得  

  $_SESSION["user_id"] = $userId;//$_SESSION["user_id"] にそのIDを保存

  echo json_encode(["success" => true]);//success: true をJSONで返す

} catch (PDOException $e) {
  echo $e -> getMessage();
  exit;
}








?>