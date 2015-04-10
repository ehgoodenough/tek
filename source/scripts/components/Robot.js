var Robot = React.createClass({
    render: function() {
        return (
            <div style={this.renderStyles()}/>
        )
    },
    renderStyles: function() {
        return {
            position: "absolute",
            backgroundColor: "red",
            width: this.props.data.width + "em",
            height: this.props.data.height + "em",
            top: this.props.data.position.y - (this.props.data.height / 2) + "em",
            left: this.props.data.position.x - (this.props.data.width / 2) + "em",
            border: this.props.selected ? "0.05em solid yellow" : "none"
        }
    }
})

module.exports = Robot
