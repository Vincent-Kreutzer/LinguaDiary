
const diaryInput = document.querySelector(".diary-input");
const diaryOutput = document.querySelector(".diary-output");
const translateBtn = document.querySelector(".translate-btn");


//翻訳ボタンイベント付与
translateBtn.addEventListener("click", () => {
	const target = diaryInput.value;
	console.log(target);
	getTranslation(target);
})

async function getTranslation(target) {
	try	{
		const response = await fetch ("api/translate.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"		
			},
			body: JSON.stringify({text: target})
		})

		const data = await response.json();

		console.log(response.status);
		console.log(data);
		console.log(JSON.stringify(data));
		diaryOutput.textContent = data;
	} catch (e) {
		console.error(e);
	}
}

