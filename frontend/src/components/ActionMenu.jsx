import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ActionMenu = ({ item, onEdit, onDelete }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpen = (e) => setAnchorEl(e.currentTarget);
	const handleClose = () => setAnchorEl(null);

	return (
		<>
			<IconButton size="small" onClick={handleOpen}>
				<MoreVertIcon fontSize="small" />
			</IconButton>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				<MenuItem
					onClick={() => {
						onEdit(item);
						handleClose();
					}}
				>
					Sửa
				</MenuItem>

				<MenuItem
					onClick={() => {
						onDelete(item);
						handleClose();
					}}
				>
					Xóa
				</MenuItem>
			</Menu>
		</>
	);
};

export default ActionMenu;
