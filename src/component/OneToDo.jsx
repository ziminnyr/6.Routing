export const OneToDo = () => {
	const params = useParams();

	const onDeleteTask = (id) => {
		const confirmation = confirm('Подтвердите удаление');

		if (!confirmation) return 0;

		fetch(TODO_LIST + `/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача удалена', response);
				makeRefresh();
			})
			.catch((error) => console.log('Ошибка удаления данных:', error))
			.finally(() => setInProcess(false));
	};

	return (
		<div>
			<input
				type="checkbox"
				defaultChecked={completed}
				title={title}
				onChange={(e) => onUpdateTask(id, title, e.target.checked, true)}
			/>
			<h2>Задача: {params.id}</h2>
			<button className="button update" disabled={inProcess} onClick={() => onUpdateTask(id, title, completed)}>
				Обновить
			</button>
			<button className="button delete" disabled={inProcess} onClick={() => onDeleteTask(id)}>
				Удалить
			</button>
		</div>
	);
};
