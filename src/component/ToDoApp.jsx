import React, { Component } from "react";
import "./ToDoApp.css";

export default class ToDoApp extends Component {
  inputRef = React.createRef();
  flipRef = React.createRef();

  state = {
    newTask: "",
    Item: [],
    checkedItems: [],
  };
  componentDidMount() {
    const savedItem = JSON.parse(localStorage.getItem("Item"));
    const savedcheckedItems = JSON.parse(localStorage.getItem("checkedItems"));
    if (savedItem) {
      this.setState({ Item: savedItem });
    }
    if (savedcheckedItems) {
      this.setState({ checkedItems: savedcheckedItems });
    }
  }

  handleChange = (event) => {
    this.setState({
      newTask: event.target.value,
    });
  };
  storeItem = (event) => {
    event.preventDefault();
    const { newTask } = this.state;
    if (newTask.trim() === "") {
      alert("Please enter a task");
      return;
    } else {
      this.setState(
        {
          Item: [...this.state.Item, newTask],
        },
        () => {
          localStorage.setItem("Item", JSON.stringify(this.state.Item));
        }
      );
    }
    this.setState({
      newTask: "",
    });
  };
  delete = (key) => {
    this.setState(
      {
        Item: this.state.Item.filter((_, index) => index !== key),
      },
      () => {
        localStorage.setItem("Item", JSON.stringify(this.state.Item));
      }
    );
  };
  edit = (key) => {
    console.log("Edit function called with key:", key);
    const { Item, newTask } = this.state;
    if (newTask.trim() === "") {
      this.inputRef.current?.focus();
      alert("Please enter a task and click Edit again");
      return;
    } else {
      this.setState(
        {
          Item: Item.map((data, index) => (index === key ? newTask : data)),
        },
        () => {
          localStorage.setItem("Item", JSON.stringify(this.state.Item));
          this.setState({ newTask: "" });
        }
      );
    }
  };

  checkItem = (key) => {
    const { Item, checkedItems } = this.state;
    Item.forEach((data, index) => {
      if (index === key) {
        this.setState(
          {
            checkedItems: [...checkedItems, data],
            Item: Item.filter((_, key) => key !== index), // Remove the item from the original list
          },
          () => {
            localStorage.setItem(
              "checkedItems",
              JSON.stringify(this.state.checkedItems)
            );
            localStorage.setItem("Item", JSON.stringify(this.state.Item));
          }
        );
        console.log("Item checked:", Item[index]); // should not be null
      }
    });
  };

  // functions for checked items

  uncheckItem = (key) => {
    const { checkedItems, Item } = this.state;
    this.setState(
      {
        Item: [...Item, checkedItems[key]],
        checkedItems: checkedItems.filter((_, index) => index !== key),
      },
      (event) => {
        localStorage.setItem(
          "checkedItems",
          JSON.stringify(this.state.checkedItems)
        );
        localStorage.setItem("Item", JSON.stringify(this.state.Item));
      }
    );
  };

  render() {
    const { newTask, Item, checkedItems } = this.state;

    return (
      <div className="body">
        <div className="box">
          <div className="head">
            <div id="heading">
              <h1>ListiFy.</h1>
            </div>
            <div id="form">
              <form action="" onSubmit={this.storeItem}>
                <input
                  type="text"
                  placeholder="Add new items here..."
                  value={newTask}
                  onChange={this.handleChange}
                  ref={this.inputRef}
                />
                <button onClick={this.storeItem}>Add</button>
              </form>
            </div>
          </div>
          <div ref={this.flipRef} className="Item">
            <div className="itemlist">
              <ul>
                {Item.map((Item, index) => {
                  return (
                    <li key={index}>
                      <div className="content">
                        <div
                          onClick={(e) => {
                            this.checkItem(index);
                            // this.changeStyle(e)
                          }}
                          className="buy"
                        ></div>
                        {Item}
                      </div>
                      <div className="icons">
                        <i
                          className="bi bi-pencil"
                          onClick={() => this.edit(index)}
                        ></i>
                        <i
                          onClick={() => this.delete(index)}
                          className="fas fa-trash"
                        ></i>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="bought-list">
              <ul>
                {checkedItems.map((checkedItems, index) => {
                  return (
                    <li key={index}>
                      <div className="content">
                        <div
                          onClick={(e) => {
                            this.uncheckItem(index);
                          }}
                          className="buy bought"
                        ></div>
                        {checkedItems}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="buttons">
            <button
              className="btn"
              id="bought-btn"
              onClick={(e) => {
                this.flipRef.current.classList.toggle("flipped");
                if (this.flipRef.current.classList.contains("flipped")) {
                  e.target.innerText = "  Cart List  ";
                  e.target.style.backgroundColor = "#E37C78";
                } else {
                  e.target.innerText = "Bought List";
                  e.target.style.backgroundColor = " #006078";
                }
              }}
            >
              Bought List
            </button>
            <button
              className="btn"
              id="clear-btn"
              onClick={(e) => {
                // this.setState({ Item: [], checkedItems: [] });
                // localStorage.removeItem("Item");
                // localStorage.removeItem("checkedItems");
                if (this.flipRef.current.classList.contains("flipped")) {
                  this.setState({ checkedItems: [] });
                  localStorage.removeItem("checkedItems");
                } else {
                  this.setState({ Item: [] });
                  localStorage.removeItem("Item");
                }
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    );
  }
}
