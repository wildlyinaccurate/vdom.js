class Counter extends Component {
    state = { count: 0 };

    constructor(props) {
        super(props);
    }

    increment() {
        this.setState({ count: this.state.count + 1 });
    }

    render() {
        const buttonText = this.props.buttonText || "+1";

        return createVNode("div", null, [
            `Counter value: ${this.state.count} `,
            createVNode("button", { onclick: () => this.increment() }, [
                buttonText,
            ]),
        ]);
    }
}
