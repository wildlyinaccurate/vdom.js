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
            domNode = getComponentVNode(vnode, parentDom);
        } else {
            // For "regular" vnodes, we create a HTMLElement of the node's type.
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

function getComponentVNode(vnode, parentDom) {
    // The vnode's type property is the component class
    const Component = vnode.type;

    // Create an instance of the component with the props passed in, and call
    // the component's render() function to get its VDOM tree.
    const instance = new Component(vnode.props);
    const newVNode = instance.render();

    // Now that we have a "regular" vdom tree, we can pass it back to mount()
    return mount(newVNode, parentDom);
}

class Component {
    constructor(props) {
        this.props = props || {};
        this.state = {};
    }

    // We will implement this later
    setState(newState) {}

    // This will be implemented by the extending component
    render() {}
}
