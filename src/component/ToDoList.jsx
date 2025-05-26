import { TODO_LIST_URL } from '../assets/data.env';
import debounce from 'debounce';
import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const ToDoList = () => {
	const [originalTodos, setOriginalTodos] = useState([]);
	const [inProcess, setInProcess] = useState(false);
	const [reloadTrigger, setReloadTrigger] = useState(1);
	const [isSorted, setIsSorted] = useState(false);
	const [searchStr, setSearchStr] = useState('');

	const makeRefresh = () => setReloadTrigger((p) => p + 1);

	useEffect(() => {
		fetch(TODO_LIST_URL)
			.then((loadedTodos) => loadedTodos.json())
			.then((tasks) => {
				setOriginalTodos(tasks);
			})
			.catch((error) => console.log('Ошибка загрузки данных:', error));
	}, [reloadTrigger]);

	const onAddTask = () => {
		const taskName = prompt('Введите наименование задачи');

		if (!taskName) {
			console.log('Задача не добавлена');
			return;
		}

		setInProcess(true);

		fetch(TODO_LIST_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: taskName,
				completed: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача добавлена', response);
				makeRefresh();
			})
			.catch((error) => console.log('Ошибка добавления данных:', error))
			.finally(() => setInProcess(false));
	};

	const toggleCompleteTask = (id, taskName, isDone) => {
		setInProcess(true);
		fetch(TODO_LIST_URL + `/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				title: taskName,
				completed: isDone,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача обновлена', response);
				makeRefresh();
			})
			.catch((error) => console.log('Ошибка обновления данных:', error))
			.finally(() => setInProcess(false));
	};

	const todos = useMemo(() => {
		let todosCopy = [...originalTodos];

		if (isSorted) {
			todosCopy.sort((a, b) => a.title.localeCompare(b.title));
		}

		if (searchStr) {
			todosCopy = todosCopy.filter((el) => el.title.toLowerCase().includes(searchStr.toLowerCase()));
		}

		return todosCopy;
	}, [isSorted, originalTodos, searchStr]);

	return (
		<>
			<button className="add-button" onClick={onAddTask} disabled={inProcess}>
				Добавить задание
			</button>
			<button
				className={isSorted ? 'sort active' : 'sort'}
				onClick={() => {
					setIsSorted((prev) => !prev);
				}}
			>
				Сортировка А-Я
			</button>
			<input className="search-input" type="text" onChange={debounce((e) => setSearchStr(e.target.value), 500)}></input>
			<ul className="list">
				{todos.map(({ id, title, completed }) => (
					<li className="task" key={id} id={id}>
						<input
							type="checkbox"
							defaultChecked={completed}
							title={title}
							disabled={inProcess}
							onChange={(e) => toggleCompleteTask(id, title, e.target.checked)}
						/>
						<Link to={`task/${id}`}>{title}</Link>
					</li>
				))}
			</ul>
		</>
	);
};
