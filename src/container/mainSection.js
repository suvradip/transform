import { connect } from "react-redux";
import MainApp from "../components/MainApp";

const mapStateToProps = state => ({
   ...state.playground
});

export default connect(mapStateToProps)(MainApp);
