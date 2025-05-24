import { useEffect, useState } from 'react';
import { TODO_LIST_URL } from '../assets/data.env';
import { useParams } from 'react-router-dom';

export const OneToDo = () => {
	const { id } = useParams();
	const [singleTask, setSingleTask] = useState({});
	const [reloadTrigger, setReloadTrigger] = useState(1);

	const makeRefresh = () => setReloadTrigger((p) => p + 1);

	useEffect(() => {
		fetch(`${TODO_LIST_URL}/${id}`)
			.then((loadedTask) => loadedTask.json())
			.then((task) => {
				setSingleTask(task);
			})
			.catch((error) => console.log('Ошибка загрузки данных:', error));
	}, [id, reloadTrigger]);

	const onUpdateTask = (id, taskName, isDone, ifCheckbox = 0) => {
		const newTaskName = ifCheckbox ? taskName : prompt('Отредактируйте наименование задания', taskName);

		if (!newTaskName) {
			console.log('Задача не обновлена');
			return;
		}

		fetch(`${TODO_LIST_URL}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: newTaskName,
				completed: isDone,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача обновлена', response);
				makeRefresh();
			})
			.catch((error) => console.log('Ошибка обновления данных:', error));
	};

	const onDeleteTask = (id) => {
		const confirmation = confirm('Подтвердите удаление');

		if (!confirmation) return;

		fetch(TODO_LIST_URL + `/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача удалена', response);
				makeRefresh();
			})
			.catch((error) => console.log('Ошибка удаления данных:', error));
	};

	//TODO Кнопка НАЗАД в заглавии для возврата - useNavigate
	//TODO Страница 404
	//TODO При удалении скидывать на Главную страницу
	return (
		<div>
			<input
				type="checkbox"
				checked={singleTask.completed}
				title={singleTask.title}
				onChange={(e) => onUpdateTask(id, singleTask.title, e.target.checked, true)}
			/>
			<h2>Задача: {singleTask?.title ?? '-'}</h2>
			<button className="button update" onClick={() => onUpdateTask(id, singleTask.title, singleTask.completed)}>
				Обновить
			</button>
			<button className="button delete" onClick={() => onDeleteTask(id)}>
				Удалить
			</button>
		</div>
	);
};
