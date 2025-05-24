import { useState, useEffect } from 'react';
import { TODO_LIST_URL } from '../assets/data.env';
import { debounce } from 'debounce';

export const ToDoList = () => {
	const [todos, setTodos] = useState([]);
	const [originalTodos, setoriginalTodos] = useState([]);
	const [inProcess, setInProcess] = useState(false);
	const [needReload, setNeedReload] = useState(false);
	const [isSorted, setIsSorted] = useState(false);

	const makeRefresh = () => setNeedReload(!needReload);

	useEffect(() => {
		fetch(TODO_LIST_URL)
			.then((loadedTodos) => loadedTodos.json())
			.then((tasks) => {
				setTodos(tasks);
				setoriginalTodos(tasks);
			})
			.catch((error) => console.log('Ошибка загрузки данных:', error));
	}, [needReload]);

	const onAddTask = () => {
		const taskName = prompt('Введите наименование задачи');

		if (!taskName) {
			console.log('Задача не добавлена');
			return;
		}

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

	const onUpdateTask = (id, taskName, isDone, ifCheckbox = 0) => {
		const newTaskName = ifCheckbox ? taskName : prompt('Отредактируйте наименование задания', taskName);

		if (!newTaskName) {
			console.log('Задача не обновлена');
			return;
		}

		fetch(TODO_LIST_URL + `/${id}`, {
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
			.catch((error) => console.log('Ошибка обновления данных:', error))
			.finally(() => setInProcess(false));
	};

	//сортировка заданий из БД
	const sortTasks = () => {
		const sortedTodos = isSorted ? [...todos].sort((a, b) => a.id - b.id) : [...todos].sort((a, b) => a.title.localeCompare(b.title));
		setTodos(sortedTodos);
		setIsSorted(!isSorted);
	};

	const filterTasks = (searchStr) => {
		if (!searchStr) {
			setTodos([...originalTodos]);
			return;
		}
		const listOfTodos = [...originalTodos];
		const filteredTodos = listOfTodos.filter((task) => task.title.toLowerCase().indexOf(searchStr.toLowerCase()) > -1);

		// const filteredTodos = [...todos].filter([...todos].indexOf(searchStr) > -1);
		setTodos(filteredTodos);
	};

	return (
		<>
			<button className="add-button" onClick={onAddTask} disabled={inProcess}>
				Добавить задание
			</button>
			<button className={isSorted ? 'sort active' : 'sort'} onClick={sortTasks}>
				Сортировка А-Я
			</button>
			<input className="search-input" type="text" onChange={debounce((e) => filterTasks(e.target.value), 500)}></input>
			<ul className="list">
				{todos.map(({ id, title, completed }) => (
					<li className="task" key={id} id={id}>
						<input
							type="checkbox"
							defaultChecked={completed}
							title={title}
							onChange={(e) => onUpdateTask(id, title, e.target.checked, true)}
						/>
						<Link to={`task/${id}`}>{title}</Link>
					</li>
				))}
			</ul>
		</>
	);
};
