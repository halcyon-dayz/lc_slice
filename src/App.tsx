import React, { useEffect, useState} from 'react';
import './App.css';
import { 
  Header, 
  Layout, 
  NavBarBue, 
  NavBar, 
  NavBarLeft, 
  NavItem,
  ImageProps,
  NavItemProps,
  Main,
  Content,
  ProblemContainer
} from './styles';

import {Container, Section, Bar} from "react-simple-resizer"
import { PathFindingVisualizer } from './components/PathFindingVisualizer/PathfindingVisualizer';
import styles from "./App.module.css"
import { Controls } from './components/Controls';
import { useDispatch, useSelector } from 'react-redux';
import { gridSelector, changeCellSize, changeCell} from './features/grid/gridSlice';
import { GridDS, RootState } from './utils/types';


const NavItemLeftList: NavItemProps[] = [

  {
    text: "",
    href:"http://www.leetcode.com",
    imageProps: {
      imageURLs: ["/orange-slice.svg", "/leetcode.svg"],
      height: 35,
      width: 35,
      margin: "7px 0px 0px 0px"
    }
  },
  {
    text: "Explore"
  },
  {
    text: "Problems"
  },
  {
    text: "Interview"
  },
  {
    text: "Contest"
  },
  //Try to maintain width height ratio of sv
]

type HeaderLayoutProps = {
  leftList: NavItemProps[]
}

const HeaderLayout = ({leftList}: HeaderLayoutProps) => {
  return (<Layout>
    <Header>
      <NavBarBue>
        <NavBar>
          <NavBarLeft>
            {leftList.map((li, idx) => (
              <NavItem
                key={idx}
                text={li.text}
                imageProps={li.imageProps}
                href={li.href}
                />
            ))}
          </NavBarLeft>
        </NavBar>
      </NavBarBue>
    </Header>
  </Layout>);
}

function App() {

  const [height, setHeight] = useState<number>(window.innerHeight - 44);

  const grid = useSelector((state) => state);
  console.log(grid);
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight - 44);
    });
  }, []);


  useEffect(() => {
    if (grid.startNodeRow === undefined) {
      return;
    }
    const endRow = grid.height - 1;
    const endCol = grid.width - 1;
    dispatch(changeCell({row: endRow, col: endCol, data: grid.cells[endRow][endCol].data, status: "END"}))

  }, [grid.startNodeRow, grid.width, grid.height])


  const onRightSizeChange = (currentSize: number) => {
    if (currentSize < grid.cellStyleWidth * grid.width) {
      dispatch(changeCellSize({width: 25, height: 25}))
    } else if (currentSize > grid.cellStyleWidth * grid.width && grid.cellStyleWidth < 50) {
      dispatch(changeCellSize({width: 50, height: 50}))
    }
  }

  return (
    <div className="App">
      <HeaderLayout leftList={NavItemLeftList}/>
      <Main>
        <Container style={{position: "relative", height: `${height}px`}}>
        <Section style={{ background: 'rgb(240, 240, 240)' }} minSize={100}>
          <Controls />
        </Section>
        <Bar size={10} style={{ background: '#738228', cursor: 'col-resize' }} />
        <Section style={{ 
          background: 'rgb(240, 240, 240)', 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
          }} minSize={100}
            onSizeChanged={onRightSizeChange}>
          <PathFindingVisualizer />
        </Section>


        </Container>
      </Main>    
    </div>
  );
}

export default App;
