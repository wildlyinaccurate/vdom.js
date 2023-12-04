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
        if (typeof vnode.type === "function") {
            // If the vnode type is a function, we can assume it is a component.
            const Component = vnode.type;

            // We create an instance of the component with the props passed in.
            const instance = new Component(vnode.props);

            // Then we call the component's render() function which returns a VDOM tree.
            // Just like we do with child components, this VDOM tree is passed recursively
            // into the mount function.
            domNode = mount(instance.render(), parentDom);
        } else {
            // For everything else, we assume vnode.type is a tag name and create a HTMLElement.
            domNode = document.createElement(vnode.type);
        }

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

    return domNode;
}

class Component {
    state = {};

    constructor(props) {
        this.props = props || {};
    }

    setState(newState) {
        console.log("Setting state of", this.constructor.name, "to", newState);
    }

    render() {}
}
