const React = require('react');

class SceneMarker extends React.Component {

    constructor(props) {
        super(props);

        // A hack to bind 'this' to always point at the SceneMarker component
        // https://github.com/goatslacker/alt/issues/283
        this.tick = this.tick.bind(this);

        this.state = {
            isActive: false,
            startTime: Date.now(),
            curElapsedTime: Date.now()
        };

        // Timer is instantiated upon mounting
        this.timer = null;
    }


    componentDidMount() {
        // Create a timer which ticks every 50ms
        this.timer = setInterval(this.tick, 50);

        // Set the start time to the moment the component mounts.
        this.state.startTime = Date.now();
        this.state.elapsedTime = this.state.startTime - Date.now();
    }


    componentWillUnmount() {
        // Clear the timer when the component is being disposed
        clearInterval(this.timer);
    }

    // Tick on the timer's interval and perform all business logic for the timer
    tick() {
        this.setState(
            // React's setState function is called asynchronously
            // in order to ensure accurate timing, we pass an anonymous function
            // in as an argument as a cheat to force pseudo-synchronous updates
            (prevState) => {
                return {
                    curElapsedTime: Date.now() - prevState.startTime,
                    isActive: prevState.curElapsedTime > parseInt(this.props.triggerTime * 1000)
                }
            }
        )
    }


    render() {
        if (this.state.isActive) {

            var targetIndexPropString = "targetIndex: " + this.props.targetIndex;
            var targetIndexString = this.props.targetIndex;

            return (
                    <a-box data-targetindex={targetIndexString} cursor-listener position={this.props.position} scale="2 2 2" color="#00FF00" ></a-box>
            )
        } else {
            return null;
        }

        // Execution only loops here if marker is not already active

    }

}

module.exports = SceneMarker;

