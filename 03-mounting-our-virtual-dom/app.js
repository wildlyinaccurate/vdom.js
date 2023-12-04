// Our "application" code is just a function that returns a VDOM tree.
function app() {
    return createVNode("div", { className: "container" }, [
        createVNode("h1", null, ["Hello, World!"]),
        createVNode("p", null, [
            "We're building a ",
            createVNode("small", null, ["(really simple)"]),
            " virtual DOM library.",
        ]),
    ]);
}
