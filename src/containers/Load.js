import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import Snackbar from 'material-ui/Snackbar';
import * as CONSTANTS from '../define';
import { loadImpossessionFile } from '../actions/item';
import { calc } from '../actions/simulator';

class Load extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      message: '初期化中',
    };
  }
  onDropAccepted(files, stages, items, selectedStage) {
    this.setState({
      open: true,
      message: 'ファイル読み込み中…',
    });
    this.reader = new FileReader();
    this.reader.onload = () => {
      const regex = new RegExp(/\[[0-9",]+\]$/);
      if (regex.test(this.reader.result)) {
        const impossessions = JSON.parse(this.reader.result);
        localStorage.setItem('impossessions', JSON.stringify(impossessions)); // string
        this.props.onLoadFile(
          impossessions.map(v => parseInt(v, 10)), // number
          stages,
          items,
          selectedStage,
        );
        this.setState({
          open: true,
          message: 'ファイル読み込みが完了しました。',
        });
      } else {
        this.setState({
          open: true,
          message: 'ファイル読み込みに失敗しました。ファイルの中身が正しくありません。',
        });
      }
    };
    this.reader.readAsText(files[0]);
  }
  onDropRejected() {
    this.setState({
      open: true,
      message: 'ファイル読み込みに失敗しました。jsonファイルをアップしてください。',
    });
  }
  handleClose() {
    this.setState({ open: false });
  }
  render() {
    return (
      <section style={{ display: this.props.viewMode === CONSTANTS.VIEW_MODE.SAVE_LOAD ? '' : 'none' }}>
        <div>
          非所持アイテム情報をファイルから読み込みます。
        </div>
        <div>
          <Dropzone
            onDropAccepted={e => this.onDropAccepted(
              e,
              this.props.stages,
              this.props.items,
              this.props.selectedStage,
            )}
            onDropRejected={e => this.onDropRejected(e)}
            accept="application/json"
          >
            <div>
                ファイルを指定またはドラッグ&ドロップしてください。
            </div>
          </Dropzone>
        </div>
        <Snackbar
          open={this.state.open}
          autoHideDuration={5000}
          onClose={e => this.handleClose(e)}
          message={this.state.message}
        />
      </section>
    );
  }
}

Load.propTypes = {
  viewMode: PropTypes.number.isRequired,
  onLoadFile: PropTypes.func.isRequired,
  stages: PropTypes.arrayOf(Object).isRequired,
  items: PropTypes.arrayOf(Object).isRequired,
  selectedStage: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({
  viewMode: state.viewMode,
  stages: state.stages,
  items: state.items,
  selectedStage: state.selectedStage,
});
const mapDispatchToProps = dispatch => ({
  onLoadFile: (impossessions, stages, items, selectedStage) => {
    dispatch(loadImpossessionFile(impossessions));
    // re-calc
    dispatch(calc(stages, items, selectedStage, impossessions));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Load);