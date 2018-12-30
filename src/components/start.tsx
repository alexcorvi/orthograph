import * as data from '../data';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
	Button,
	InputBase,
	Paper,
	TextField,
	Typography
	} from '@material-ui/core';
import { computed, observable } from 'mobx';
import { CreateNewFolderOutlined, OpenInBrowser } from '@material-ui/icons';
import { observer } from 'mobx-react';

@observer
export class Start extends React.Component<{ onHavingAlbum: (album: data.Album) => void }> {
	@observable newAlbumTitle = '';

	createNewAlbum() {
		if (this.newAlbumTitle) {
			const newAlbum = new data.Album();
			newAlbum.title = this.newAlbumTitle;
			this.props.onHavingAlbum(newAlbum);
		}
	}

	openExistingAlbum(file: string) {
		const fileData = atob(file.split('base64,')[1]).split('orthograph:')[1];
		if (fileData) {
			console.log(fileData);
			const newAlbum = new data.Album(JSON.parse(fileData));
			this.props.onHavingAlbum(newAlbum);
		} else {
			alert('Invalid file');
		}
	}

	render() {
		return (
			<div className="start">
				<Typography variant="h2" component="h2" style={{ textAlign: 'center' }}>
					Orthograph
				</Typography>
				<br />
				<br />
				<br />
				<Paper style={{ padding: 15, width: 400, margin: '0 auto' }} elevation={1}>
					<label htmlFor="open">
						<Button color="primary" component="span">
							<OpenInBrowser fontSize="small" style={{ marginRight: 5 }} />
							Open existing album
						</Button>
					</label>
					<input
						hidden
						id={'open'}
						multiple={false}
						type="file"
						onChange={(e) => {
							if (e.target.files && e.target.files.length > 0) {
								const reader = new FileReader();
								reader.addEventListener('load', () => {
									if (typeof reader.result === 'string') {
										this.openExistingAlbum(reader.result);
									}
								});
								reader.readAsDataURL(e.target.files[0]);
							}
						}}
					/>{' '}
				</Paper>
				<Paper style={{ padding: 15, width: 400, margin: '0 auto', marginTop: 15 }} elevation={1}>
					<TextField
						fullWidth
						label="or create new"
						margin="dense"
						variant="outlined"
						value={this.newAlbumTitle}
						onChange={(e) => (this.newAlbumTitle = e.target.value)}
						onKeyPress={(e) => {
							if (e.which === 13) {
								this.createNewAlbum();
							}
						}}
					/>
					{this.newAlbumTitle ? (
						<Button color="primary" onClick={() => this.createNewAlbum()}>
							<CreateNewFolderOutlined fontSize="small" style={{ marginRight: 5 }} />
							Create
						</Button>
					) : (
						''
					)}
				</Paper>
			</div>
		);
	}
}
