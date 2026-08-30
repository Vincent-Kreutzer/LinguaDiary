<?php
session_start();

//セッションにユーザーIDが登録されているかを確認
if (isset($_SESSION["user_id"])) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false]);
  
}


?>