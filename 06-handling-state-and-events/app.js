// Our "application" code is just a function that returns a VDOM tree.
function app() {
    const containerStyle = {
        margin: "0 auto",
        textAlign: "center",
        width: "50%",
    };

    return createVNode("div", { className: "container" }, [
        createVNode("h1", null, ["Hello, World!"]),
        createVNode("p", null, [
            createVNode(Counter),
            createVNode(Counter, { buttonText: "Add One" }),
        ]),
    ]);
}
