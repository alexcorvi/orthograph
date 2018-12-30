import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactCrop from 'react-image-crop';
import { Cancel, Check } from '@material-ui/icons';
import {
    Dialog,
    DialogTitle,
    Grid,
    IconButton,
    Typography
    } from '@material-ui/core';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-image-crop/lib/ReactCrop.scss';

@observer
export class CropImageModal extends React.Component<{
	src: string;
	onDismiss: () => void;
	onSave: (src: string) => void;
}> {
	@observable crop = { x: 0, y: 0, width: 0, aspect: 7 / 4 };

	@observable pixelCrop: ReactCrop.PixelCrop = { x: 0, y: 0, width: 0, height: 0 };

	@observable image: HTMLImageElement | undefined = undefined;

	render() {
		return (
			<Dialog
				open={!!this.props.src.length}
				onClose={() => {
					return;
				}}
				className="cropping-dialog"
			>
				<DialogTitle>
					<Grid container>
						<Grid item xs={6}>
							<Typography style={{ lineHeight: '48px', color: '#424242' }} variant="h6">
								Crop Image
							</Typography>
						</Grid>
						<Grid item xs={6} style={{ textAlign: 'right' }}>
							<IconButton
								disabled={!this.crop.width}
								color="primary"
								onClick={() => {
									this.props.onSave(this.getCroppedImg());
									this.props.onDismiss();
								}}
							>
								<Check />
							</IconButton>
							<IconButton color="secondary" onClick={() => this.props.onDismiss()}>
								<Cancel />
							</IconButton>
						</Grid>
					</Grid>
				</DialogTitle>
				<ReactCrop
					crop={this.crop}
					src={this.props.src}
					onChange={(crop, pixelCrop) => {
						this.crop = crop as any;
						this.pixelCrop = pixelCrop;
					}}
					onImageLoaded={(image) => {
						this.image = image;
					}}
				/>
			</Dialog>
		);
	}

	getCroppedImg() {
		const canvas = document.createElement('canvas');
		canvas.width = this.pixelCrop.width;
		canvas.height = this.pixelCrop.height;
		const ctx = canvas.getContext('2d');

		if (!ctx || !this.image) {
			return '';
		}

		ctx.drawImage(
			this.image,
			this.pixelCrop.x,
			this.pixelCrop.y,
			this.pixelCrop.width,
			this.pixelCrop.height,
			0,
			0,
			this.pixelCrop.width,
			this.pixelCrop.height
		);

		return canvas.toDataURL('image/jpeg');
	}
}
