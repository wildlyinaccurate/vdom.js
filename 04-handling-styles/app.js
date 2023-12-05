// Our "application" code is just a function that returns a VDOM tree.
function app() {
    return createVNode(
        "div",
        { className: "container", style: "text-align: center" },
        [
            createVNode("h1", null, ["Hello, World!"]),
            createVNode("p", { style: { color: "blue" } }, [
                "We're building a ",
                createVNode("small", { style: { fontWeight: "bold" } }, [
                    "(really simple)",
                ]),
                " virtual DOM library.",
            ]),
        ]
    );
}
