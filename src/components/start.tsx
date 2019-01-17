import * as data from "../data/album-data";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
	Button,
	InputBase,
	Paper,
	TextField,
	Typography,
	List,
	ListItemAvatar,
	ListItem,
	Avatar,
	ListItemText,
	ListItemSecondaryAction,
	IconButton
} from "@material-ui/core";
import { computed, observable } from "mobx";
import {
	CreateNewFolderOutlined,
	OpenInBrowser,
	FolderOutlined,
	Delete
} from "@material-ui/icons";
import { observer } from "mobx-react";
import { main } from "../data/main";

@observer
export class Start extends React.Component {
	@observable newAlbumTitle = "";

	createNewAlbum() {
		if (this.newAlbumTitle) {
			const newAlbum = new data.Album();
			newAlbum.title = this.newAlbumTitle;
			main.currentlyOpenAlbum = newAlbum;
			main.openedAlbum = true;
		}
	}

	render() {
		return (
			<div className="start">
				<div className="logo" />
				<Typography
					variant="h2"
					component="h2"
					style={{ textAlign: "center" }}
				>
					Orthograph
				</Typography>
				<br />
				<br />
				<br />

				{main.validToken ? (
					<div>
						<Paper
							style={{
								padding: 15,
								width: 400,
								margin: "0 auto",
								marginBottom: 15
							}}
							elevation={1}
						>
							<TextField
								fullWidth
								label="Create new"
								margin="dense"
								variant="outlined"
								value={this.newAlbumTitle}
								onChange={e =>
									(this.newAlbumTitle = e.target.value)
								}
								onKeyPress={e => {
									if (e.which === 13) {
										this.createNewAlbum();
									}
								}}
							/>
							{this.newAlbumTitle ? (
								<Button
									color="primary"
									onClick={() => this.createNewAlbum()}
								>
									<CreateNewFolderOutlined
										fontSize="small"
										style={{ marginRight: 5 }}
									/>
									Create
								</Button>
							) : (
								""
							)}
						</Paper>
						<Paper
							style={{
								padding: 15,
								width: 400,
								margin: "0 auto"
							}}
							elevation={1}
						>
							{main.availableAlbums.map(album => {
								return (
									<List key={album.id} dense>
										<ListItem
											button
											onClick={() => {
												main.setHash(
													main.accessToken,
													album.name
												);
											}}
										>
											<ListItemAvatar>
												<Avatar>
													<FolderOutlined />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={
													album.name.split("__")[1]
												}
												secondary={`${Math.round(
													album.size / 1000
												)}KB / ${new Date(
													album.client_modified
												).toLocaleDateString()}`}
											/>
											<ListItemSecondaryAction>
												<IconButton
													aria-label="Delete"
													onClick={() => {
														main.delAlbum(
															album.name
														).then(() => {
															main.listAlbums();
														});
													}}
												>
													<Delete />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									</List>
								);
							})}
						</Paper>
					</div>
				) : (
					<Paper
						style={{
							padding: 15,
							width: 400,
							margin: "0 auto",
							marginBottom: 15
						}}
						elevation={1}
					>
						<TextField
							fullWidth
							label="Access Token"
							margin="dense"
							variant="outlined"
							value={main.accessToken}
							onChange={e => main.setHash(e.target.value, "")}
						/>
					</Paper>
				)}
			</div>
		);
	}
}
