import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from '@skidding/react-codemirror';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getFcConfig } from '../../actions';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './style.scss';

function formatCode(jsString) {
   try {
      return window.prettier.format(jsString, {
         parser: 'babel',
         plugins: window.prettierPlugins,
         tabWidth: 4,
         printWidth: 60,
         semi: true,
         singleQuote: true,
         useTabs: false,
      });
   } catch (error) {
      console.log(error.message);
      return false;
   }
}

const codeMirrorOptions = {
   theme: 'material',
   mode: 'javascript',
   indentUnit: 3,
   tabSize: 3,
   lineNumbers: true,
   matchBrackets: true,
   foldGutter: true,
   continueComments: 'Enter',
   extraKeys: { 'Cmd-/': 'toggleComment' },
   gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
};

class Editor extends React.Component {
   constructor(props) {
      super(props);
      const { disableConvert, code } = this.props;
      this.state = {
         code: formatCode(code),
         showConvertBtn: disableConvert,
         enableConvertBtn: true,
      };
   }

   componentDidUpdate(nextProps) {
      const { code } = this.props;
      if (nextProps.code !== code) {
         // eslint-disable-next-line
         this.setState({ code: formatCode(code) });
      }
   }

   updateCode = newCode => {
      this.setState({
         code: newCode,
      });
   };

   onRenderCharts = ev => {
      ev.preventDefault();
      const { onClickRun } = this.props;
      const { code } = this.state;
      onClickRun(code);
      this.setState({
         enableConvertBtn: false,
      });
   };

   onConvertHcToFc = ev => {
      ev.preventDefault();
      const { charts } = window.Highcharts;
      const { dispatch } = this.props;
      charts.forEach(async chartRef => {
         if (chartRef) {
            const chartConfig = JSON.stringify(chartRef.userOptions);
            getFcConfig(dispatch, { chartConfig });
         }
      });
   };

   tidyCode = () => {
      this.setState(state => ({
         code: formatCode(state.code),
      }));
   };

   render() {
      const { name } = this.props;
      const { showConvertBtn, enableConvertBtn, code } = this.state;
      return (
         <div className="card editor">
            <div className="card-header">
               <span className="h5 d-inline">{name}</span>
               <div className="btn-group text-right">
                  <button type="submit" className="btn btn-info" onClick={this.tidyCode}>
                     Tidy
                  </button>

                  {showConvertBtn ? (
                     <button
                        type="submit"
                        className="btn btn-info"
                        disabled={enableConvertBtn}
                        onClick={this.onConvertHcToFc}
                     >
                        convert
                     </button>
                  ) : (
                     ''
                  )}

                  <button type="submit" className="btn btn-success" onClick={this.onRenderCharts}>
                     Run
                  </button>
               </div>
            </div>
            <div className="card-body">
               <CopyToClipboard text={code}>
                  <button type="submit" className="btn btn-outline-light copy-btn btn-sm">
                     Copy
                  </button>
               </CopyToClipboard>

               <CodeMirror value={code} options={codeMirrorOptions} onChange={this.updateCode} />
            </div>
         </div>
      );
   }
}

Editor.propTypes = {
   name: PropTypes.string.isRequired,
   code: PropTypes.string.isRequired,
   disableConvert: PropTypes.bool,
   onClickRun: PropTypes.func.isRequired,
   dispatch: PropTypes.func.isRequired,
};

Editor.defaultProps = {
   disableConvert: true,
};

export default Editor;
