function createVNode(type, props, children) {
    return {
        type,
        props,
        children,
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
            domNode = createComponentNode(vnode, parentDom);
        } else {
            // For "regular" vnodes, we create a HTMLElement of the node's type.
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

// Create a component node for a component vnode
function createComponentNode(vnode, parentDom) {
    const Component = vnode.type;

    // Create an instance of the component with the props passed in, and call
    // the component's render() function to get its VDOM tree.
    const instance = new Component(vnode.props);
    const newVNode = instance.render();

    // Store the component's parent DOM and VDOM tree on the instance for
    // future updates.
    instance._currentVNode = newVNode;
    instance._parentDom = parentDom;

    // Now that we have a "regular" vdom tree, we can pass it back to mount()
    return mount(newVNode, parentDom);
}

function update(prevVNode, nextVNode, parentDom) {
    // Create a new document fragment and mount the new VDOM tree into it.
    const fragment = document.createDocumentFragment();
    const newDom = mount(nextVNode, fragment);

    // Now we can replace the old DOM node with the new DOM node.
    parentDom.replaceChild(fragment, prevVNode._dom);
}

class Component {
    constructor(props) {
        this.props = props || {};
        this.state = {};

        // Keep track of the parent DOM node and the current VDOM tree so that
        // we can call the update() function with them.
        this._parentDom = null;
        this._currentVNode = null;

        // Keep track of any pending state changes.
        this._nextState = null;
    }

    _updateComponent() {
        // Switch the instance to use the new state, and clear _nextState to indicate
        // there are no more pending state changes.
        this.state = this._nextState;
        this._nextState = null;

        // Render the component with the new state.
        const nextVNode = this.render();

        // Give the update function the old & new VDOM trees, and the parent DOM node.
        update(this._currentVNode, nextVNode, this._parentDom);

        // Store the new VDOM tree on the instance for next time.
        this._currentVNode = nextVNode;
    }

    setState(newState) {
        // Merge the new state with the old state. The spread operator ensures
        // we copy the values rather than modifying the existing objects.
        this._nextState = { ...this.state, ...newState };

        // Update the component.
        this._updateComponent();
    }

    // This will be implemented by the extending component
    render() {}
}
