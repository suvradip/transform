import React from "react";
import CodeMirror from "@skidding/react-codemirror";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getFcConfig } from "../../actions";

import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/comment/continuecomment";
import "codemirror/addon/comment/comment";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/indent-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "./style.scss";

function formatCode(jsString) {
   try {
      return window.prettier.format(jsString, {
         parser: "babel",
         plugins: window.prettierPlugins,
         tabWidth: 4,
         printWidth: 60,
         semi: true,
         singleQuote: true,
         useTabs: false
      });
   } catch (error) {
      console.log(error.message);
   }
}

const codeMirrorOptions = {
   theme: "material",
   mode: "javascript",
   indentUnit: 3,
   tabSize: 3,
   lineNumbers: true,
   matchBrackets: true,
   foldGutter: true,
   continueComments: "Enter",
   extraKeys: { "Cmd-/": "toggleComment" },
   gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
};

class Editor extends React.Component {
   constructor(props) {
      super(props);
      const { disableConvert = true, code } = this.props;
      this.state = {
         code: formatCode(code),
         showConvertBtn: disableConvert,
         enableConvertBtn: true
      };
   }

   updateCode = newCode => {
      this.setState({
         code: newCode
      });
   };

   onRenderCharts = ev => {
      ev.preventDefault();
      this.props.onClickRun(this.state.code);
      this.setState({
         enableConvertBtn: false
      });
   };

   onConvertHcToFc = ev => {
      ev.preventDefault();
      const { charts } = window.Highcharts;
      charts.forEach(async chartRef => {
         if (chartRef) {
            const chartConfig = JSON.stringify(chartRef.userOptions);
            getFcConfig(this.props.dispatch, { chartConfig });
         }
      });
   };

   tidyCode = () => {
      this.setState(state => ({
         code: formatCode(state.code)
      }));
   };

   componentDidUpdate(nextProps) {
      const { code } = this.props;
      if (nextProps.code !== code) {
         this.setState({ code: formatCode(code) });
      }
   }

   render() {
      return (
         <div className="card editor">
            <div className="card-header">
               <span className="h5 d-inline">{this.props.name}</span>
               <div className="btn-group text-right">
                  <button className="btn btn-info" onClick={this.tidyCode}>
                     Tidy
                  </button>

                  {this.state.showConvertBtn ? (
                     <button
                        className="btn btn-info"
                        disabled={this.state.enableConvertBtn}
                        onClick={this.onConvertHcToFc}
                     >
                        convert
                     </button>
                  ) : (
                     ""
                  )}

                  <button
                     className="btn btn-success"
                     onClick={this.onRenderCharts}
                  >
                     Run
                  </button>
               </div>
            </div>
            <div className="card-body">
               <CopyToClipboard text={this.state.code}>
                  <button
                     id="hc-code-copy"
                     className="btn btn-outline-light copy-btn btn-sm"
                  >
                     Copy
                  </button>
               </CopyToClipboard>

               <CodeMirror
                  ref="editor"
                  value={this.state.code}
                  options={codeMirrorOptions}
                  onChange={this.updateCode}
               />
            </div>
         </div>
      );
   }
}

export default Editor;
