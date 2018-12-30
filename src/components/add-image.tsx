import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AddAPhoto } from '@material-ui/icons';
import { Button, Paper, Typography } from '@material-ui/core';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export class AddImage extends React.Component<{ title: string; onSelect: (src: string) => void }> {
	@observable id: number = Math.round(Math.random() * 1000);

	render() {
		return (
			<div className="add-image">
				<Typography variant="overline">Add {this.props.title}</Typography>
				<label htmlFor={'upload' + this.id}>
					<Button
						color="default"
						variant="outlined"
						component="span"
						style={{ border: '1px dashed #e3e3e3' }}
					>
						<AddAPhoto fontSize="large" />
					</Button>
				</label>
				<input
					hidden
					accept="image/*"
					id={'upload' + this.id}
					multiple={false}
					type="file"
					onChange={(e) => {
						if (e.target.files && e.target.files.length > 0) {
							const reader = new FileReader();
							reader.addEventListener('load', () => {
								if (typeof reader.result === 'string') {
									this.props.onSelect(reader.result);
								}
							});
							reader.readAsDataURL(e.target.files[0]);
						}
					}}
				/>
			</div>
		);
	}
}
