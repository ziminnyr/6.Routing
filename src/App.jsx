import { Routes, Route } from 'react-router-dom';
import './index.css';
import { ToDoList } from './component/ToDoList';
import { OneToDo } from './component/OneToDo';

export const App = () => {
	return (
		<Routes>
			<Route path="/" element={<ToDoList />} />
			<Route path="task/:id" element={<OneToDo />} />
		</Routes>
	);
};
