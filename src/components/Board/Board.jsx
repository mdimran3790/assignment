import React, { useEffect, useState } from "react";
import "./board.css";
import icon from "../../images/dropdown.png";
import setting from "../../images/setting.png";
import Dropdown from "../dropdown/Dropdown";
import plus from "../../images/plus.png";
import more from "../../images/more.png";
import Card from "../Card/Card";
import { reactLocalStorage } from "reactjs-localstorage";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const groupingFilter = ["Status", "User", "Priority"];
const orderingFilter = ["Priority", "Title"];

function Board() {
  const [groupingState, setGroupingState] = useState(groupingFilter[0]);
  const [orderingState, setOrderingState] = useState(orderingFilter[0]);
  const obj = reactLocalStorage.getObject("userView");
  console.log("obj", obj);
  const [filteredData, setFilteredData] = useState(new Map());
  const [localData, setLocalData] = useState(null);
  const [isDisplayActive, setIsDisplayActive] = useState(false);
  // const [data, setData] = useState(reactLocalStorage.getObject("userView"));
  const priorityMap = new Map();
  priorityMap.set("4", "Urgent"); 
  priorityMap.set("3", "High");
  priorityMap.set("2", "Medium"); 
  priorityMap.set("1", "Low");
  priorityMap.set("0", "No priority");

  useEffect(() => {
    function filterAndSortTicketsHandler(result) {
      setLocalData(result);
      const groupedAndSortedData = filterAndSortTickets(
        result,
        groupingState,
        orderingState
      );
      setFilteredData(groupedAndSortedData);
    }
    function fetchData() {
      console.log("fetchiing");
      fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
        .then((response) => response.json())
        .then((result) => {
          filterAndSortTicketsHandler(result);
        })
        .catch((error) => console.log(error));
    }
    const isEmptyData = !localData;
    const isUserViewEmpty = filteredData.size === 0;
    if (isEmptyData && isUserViewEmpty) {
      fetchData();
    } else {
      filterAndSortTicketsHandler(localData);
    }
  }, [groupingState, orderingState]);

  function reorder(array, startIndex, endIndex) {
    const result = Array.from(array);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const sourceGroup = result.source.droppableId;
    const destinationGroup = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const updatedFilteredData = new Map(filteredData);

    const sourceGroupArray = updatedFilteredData.get(sourceGroup);
    const [draggedItem] = sourceGroupArray.splice(sourceIndex, 1);

    const destinationGroupArray = updatedFilteredData.get(destinationGroup);
    destinationGroupArray.splice(destinationIndex, 0, draggedItem);

    setFilteredData(updatedFilteredData);
  };
  console.log("fil", filteredData);
  console.log("obj", obj);
  return (
    <div className="container">
      <div className="header">
        <div
          className="display"
          onClick={() => setIsDisplayActive(!isDisplayActive)}
        >
          <img className="icon" src={setting} />
          <div>Display</div>
          <img className="icon" src={icon} />
        </div>
        {isDisplayActive && (
          <div className="drop-down-container">
            <div className="drop-down-item">
              <div className="drop-down-title">Grouping</div>
              <Dropdown
                options={groupingFilter}
                selected={groupingState}
                setSelected={setGroupingState}
              />
            </div>
            <div className="drop-down-item">
              <div className="drop-down-title">Ordering</div>
              <Dropdown
                options={orderingFilter}
                selected={orderingState}
                setSelected={setOrderingState}
              />
            </div>
          </div>
        )}
      </div>

      <div className="board">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban">
            {[...filteredData.keys()].map((group, index) => (
              <Droppable
                id={group}
                key={group}
                droppableId={group}
                direction="vertical"
              >
                {(provided, snapshot) => (  
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="kanban-column"
                    style={{
                      background: snapshot.isDraggingOver ? "#FFF" : "",
                    }}
                  >
                    <div className="kanban-header">
                      <div className="kanban-header-left">
                        <div className="kanban-dot"></div>
                        <div className="kanban-title">
                          {groupingState === groupingFilter[2]
                            ? priorityMap.get(group.toString())
                            : group}
                        </div>
                        <div className="kanban-counter">
                          {filteredData.get(group).length}
                        </div>
                      </div>
                      <div className="kanban-icons">
                        <img src={plus} className="kanban-icon" alt="Add" />
                        <img src={more} className="kanban-icon" alt="More" />
                      </div>
                    </div>
                    {filteredData.get(group).length > 0 &&
                      filteredData.get(group).map((ticket, idx) => (
                        <Draggable
                          key={ticket.id}
                          draggableId={ticket.id.toString()}
                          index={idx}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card ticket={ticket} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Board;

function filterAndSortTickets(data, grouping, ordering) {
  const sortedTickets = [...data.tickets];

  switch (ordering) {
    case "Priority":
      sortedTickets.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.title.localeCompare(b.title);
        }
        return b.priority - a.priority;
      });
      break;
    case "Title":
      sortedTickets.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      sortedTickets.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.title.localeCompare(b.title);
        }
        return b.priority - a.priority; 
      });
  }

  const result = new Map();

  sortedTickets.forEach((ticket) => {
    let groupKey;
    switch (grouping) {
      case "Status":
        groupKey = ticket.status;
        break;
      case "User":
        groupKey = data.users.find((user) => user.id === ticket.userId)?.name;
        break;
      case "Priority":
        groupKey = ticket.priority;
        break;
      default:
        groupKey = ticket.status;
    }

    if (!result.has(groupKey)) {
      result.set(groupKey, []);
    }
    result.get(groupKey).push(ticket);
  });
  return result;
}
