import * as data from '../data';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AlbumView } from './album';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Start } from './start';

@observer
export class Main extends React.Component<{}> {
	@observable album: data.Album | undefined = undefined;

	render() {
		return (
			<main className="main">
				{this.album ? (
					<AlbumView album={this.album} />
				) : (
					<Start onHavingAlbum={(album) => (this.album = album)} />
				)}
			</main>
		);
	}
}
