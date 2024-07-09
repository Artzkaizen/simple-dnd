import { useState } from "react";
import PropTypes from "prop-types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./dnd.css";

const id_gen = () => {
	return Math.random().toString(36).substr(2, 9);
};

const DraggableItem = ({ id, label }) => {
	const [{ isDragging }, drag] = useDrag({
		type: "ITEM",
		item: { id, label },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const itemClass = `draggable-item ${isDragging ? "is-dragging" : ""}`;

	return (
		<div ref={drag} className={itemClass}>
			{label}
		</div>
	);
};
DraggableItem.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
};
const Dropzone = ({ items, onDrop }) => {
	const [{ isOver, canDrop }, drop] = useDrop({
		accept: "ITEM",
		drop: (item) => onDrop(item),
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	const isActive = isOver && canDrop;
	const dropzoneClass = `dropzone ${
		isActive ? "is-active" : canDrop ? "can-drop" : ""
	}`;

	return (
		<div ref={drop} className={dropzoneClass}>
			{items.length === 0 ? (
				<div className="dropzone-empty-message">Drop here</div>
			) : (
				items.map((item) => (
					<DraggableItem key={item.id} id={item.id} label={item.label} />
				))
			)}
		</div>
	);
};
Dropzone.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	onDrop: PropTypes.func.isRequired,
};

const DragComponent = () => {
	const initialItems = Array.from({ length: 5 }, (_, index) => ({
		id: id_gen(),
		label: `Item ${index + 1}`,
	}));

	const [zone1Items, setZone1Items] = useState(initialItems);
	const [zone2Items, setZone2Items] = useState([]);

	const handleDrop = (zone, item) => {
		if (zone === 1) {
			setZone2Items((prevItems) => prevItems.filter((i) => i.id !== item.id));
			setZone1Items((prevItems) => [...prevItems, item]);
		} else {
			setZone1Items((prevItems) => prevItems.filter((i) => i.id !== item.id));
			setZone2Items((prevItems) => [...prevItems, item]);
		}
	};

	return (
		<div className="drag-component">
			<DndProvider backend={HTML5Backend}>
				<Dropzone items={zone1Items} onDrop={(item) => handleDrop(1, item)} />
				<Dropzone items={zone2Items} onDrop={(item) => handleDrop(2, item)} />
			</DndProvider>
		</div>
	);
};

export default DragComponent;
