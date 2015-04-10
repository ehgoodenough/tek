var SelectionArea = React.createClass({
    render: function() {
        return (
            <div style={this.renderStyles()}/>
        )
    },
    renderStyles: function() {
        if(this.props.selection.alpha && this.props.selection.omega) {
            return {
                borderWidth: "1px",
                borderStyle: "dotted",
                borderColor: "#111111",
                zIndex: "1",
                position: "absolute",
                top: Math.min(this.props.selection.alpha.y, this.props.selection.omega.y) + "em",
                left: Math.min(this.props.selection.alpha.x, this.props.selection.omega.x) + "em",
                width: Math.abs(this.props.selection.alpha.x - this.props.selection.omega.x) + "em",
                height: Math.abs(this.props.selection.alpha.y - this.props.selection.omega.y) + "em",
            }
        }
    }
})

module.exports = SelectionArea
