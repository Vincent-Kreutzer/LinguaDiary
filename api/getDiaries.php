<?php
session_start();

//1.DBに接続する
$dbn = "mysql:dbname=linguadiary;host=localhost;charset=utf8mb4";
$user = "root";
$password = "";
$userId = $_SESSION["user_id"];
try {
  $pdo = new PDO ($dbn, $user, $password, 
  [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);  
} catch (PDOException $e) {
  exit ("Failed to connect to the database." . $e->getMessage());
}


//2.固定ユーザーIDで日記を取得する

//SQL文用意
$sql = "SELECT * FROM diaries WHERE  user_id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([":id" => $userId]);//SQLを実行した結果をいれる

/*★execute()はPDOStatementオブジェクトのメソッド、
PDOStatementオブジェクトはSQLを実行するための準備済みオブジェクト★*/

$diaryData = $stmt->fetchAll();//結果をまとめて配列として取り出す
//3.取得結果をJSONで返す
echo json_encode($diaryData);



?>