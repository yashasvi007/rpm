import React from "react";
import { Menu } from "antd";
import { scroller, Link } from "react-scroll";
import { injectIntl } from "react-intl";
import messages from "../message";

class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "personal"
    };
  }

  scrollToElement = name => {
    scroller.scrollTo(name, {
      duration: 1000,
      delay: 0,
      smooth: true,
      offset: -180
    });
  };

  setActive = val => {
    this.setState({ active: val });
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const menu = [
      { key: formatMessage(messages.personal), value: "personal" },
      { key: formatMessage(messages.insurance), value: "insurance" },
      { key: formatMessage(messages.contacts), value: "contact" },
      { key: formatMessage(messages.medical), value: "medical" },
      { key: formatMessage(messages.settings), value: "setting" }
    ];

    let menuElement = [];
    menu.forEach((item, index) => {
      menuElement.push(
        <Menu.Item key={item.value}>
          <Link
            activeClass={"active"}
            to={item.value}
            spy={true}
            isDynamic={false}
            offset={-180}
            delay={0}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              this.scrollToElement(item.value);
            }}
            onSetActive={() => {
              this.setActive(item.value);
            }}
          >
            <div
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.scrollToElement(item.value);
              }}
            >
              {item.key}
            </div>
          </Link>
        </Menu.Item>
      );
    });

    return (
      <Menu
        mode="horizontal"
        className={"flex align-items-start justify-content-space-between"}
        selectedKeys={[this.state.active]}
        style={{}}
      >
        {menuElement}
      </Menu>
    );
  }
}

export default injectIntl(MenuBar);
