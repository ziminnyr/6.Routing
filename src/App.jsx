import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { ToDoList } from './component/ToDoList';
import { OneToDo } from './component/OneToDo';
import { Page404 } from './component/Page404';

export const App = () => {
	return (
		<Routes>
			<Route path="/" element={<ToDoList />} />
			<Route path="task/:id" element={<OneToDo />} />
			<Route path="/404" element={<Page404 />} />
			<Route path="*" element={<Navigate to="/404" />} />
		</Routes>
	);
};
