function createVNode(type, props, children) {
    return {
        type,
        props,
        children,
    };
}

// The mount function takes a vnode and mounts it to an existing "parent" DOM node
function mount(vnode, parentDom) {
    let domNode;

    if (typeof vnode === "string" || typeof vnode === "number") {
        // When the node is a string or number, we can insert a plain text node.
        domNode = document.createTextNode(vnode);
    } else {
        // For vnode objects, we create a HTMLElement of the node's type.
        domNode = document.createElement(vnode.type);

        if (vnode.props) {
            // All of the props are set as attributes on the HTMLElement.
            for (const prop in vnode.props) {
                domNode[prop] = vnode.props[prop];
            }
        }

        if (vnode.children) {
            // Any children go through the same process recursively until we have
            // mounted the whole tree.
            vnode.children.forEach((child) => mount(child, domNode));
        }
    }

    // When we're finished, append the new DOM node to the parent.
    parentDom.appendChild(domNode);
}
