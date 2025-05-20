import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { TodoList } from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<h1>Список дел</h1>
		<TodoList />
	</React.StrictMode>,
);
