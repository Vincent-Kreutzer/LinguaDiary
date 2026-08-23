<?php

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);
$diaryId = $data["currentDiaryId"];

//データベース接続
$dsn = "mysql:dbname=linguaDiary;host=localhost;charset=utf8mb4";

try {
  $pdo = new PDO (
    $dsn, "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );
} catch (PDOException $e) {
  echo $e -> getMessage();
}

//削除処理
$stmt = $pdo->prepare (
  "DELETE FROM diaries WHERE id = :id"
);

$stmt->execute (
  [":id" => $diaryId]
);

$deletedCount = $stmt->rowCount();
if ($deletedCount > 0) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false]);
}

?>