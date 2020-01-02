import React from "react";
import { connect } from "react-redux";
// import CodeMirror from "react-codemirror";
import CodeMirror from "@skidding/react-codemirror";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { CONVERT_HC_TO_FC } from "../../constants/actionTypes";

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

const mapStateToProps = state => ({
   ...state.playground.fcChartConfig
});

const mapDispatchToProps = dispatch => ({
   getAttr: payload => dispatch({ type: CONVERT_HC_TO_FC, payload })
});

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
      this.props.onClickConvert();
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
      let convertBtn;
      if (this.state.showConvertBtn) {
         convertBtn = (
            <button
               className="btn btn-info"
               disabled={this.state.enableConvertBtn}
               onClick={this.onConvertHcToFc}
            >
               convert
            </button>
         );
      }

      return (
         <div className="card editor">
            <div className="card-header">
               <span className="h5 d-inline">{this.props.name}</span>
               <div className="btn-group text-right">
                  <button className="btn btn-info" onClick={this.tidyCode}>
                     Tidy
                  </button>

                  {convertBtn}

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

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
