function createVNode(type, props, children) {
    return {
        type,
        props,
        children,
        _instance: null,
        _dom: null,
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

            // We call the component's render() function to get its VDOM tree and
            // store it on the instance.
            instance._currentVNode = instance.render();

            // We also store the parent DOM node on the instance.
            instance._parentDom = parentDom;

            // Pass the component's VDOM tree recursively to the mount() function,
            // just like we do with child nodes.
            domNode = mount(instance._currentVNode, parentDom);
        } else {
            // For everything else, we assume vnode.type is a tag name and create a HTMLElement.
            domNode = document.createElement(vnode.type);
        }

        // Store the DOM node on the VDOM node for future updates.
        vnode._dom = domNode;

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

function update(prevVNode, nextVNode, parentDom) {
    parentDom.replaceChild(mount(nextVNode, parentDom), prevVNode._dom);
}

class Component {
    constructor(props) {
        this.props = props || {};
        this.state = {};

        this._parentDom = null;
        this._currentVNode = null;
        this._nextState = null;
    }

    _updateComponent() {
        this.state = { ...this._nextState };
        this._nextState = null;
        const nextVNode = this.render();
        update(this._currentVNode, nextVNode, this._parentDom);
        this._currentVNode = nextVNode;
    }

    setState(newState) {
        this._nextState = { ...this.state, ...newState };
        this._updateComponent();
    }

    // This will be implemented by the extending component
    render() {}
}
