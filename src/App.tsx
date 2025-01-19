import { scaleSymlog } from "d3-scale";
import { useState, useRef, useEffect, useCallback } from "react";
import { nodes, links, Node, Link } from "./data";
import {
  CosmographProvider,
  Cosmograph,
  CosmographTimeline,
  CosmographHistogram,
  CosmographSearch,
  CosmographRef,
  CosmographHistogramRef,
  CosmographTimelineRef,
  CosmographSearchRef,
  CosmographSearchInputConfig,
  CosmographInputConfig
} from "@cosmograph/react";
import "./styles.css";

export default function App() {
  const cosmograph = useRef<CosmographRef>();
  const histogram = useRef<CosmographHistogramRef<Node>>();
  const timeline = useRef<CosmographTimelineRef<Link>>();
  const search = useRef<CosmographSearchRef>();
  const [degree, setDegree] = useState<number[]>([]);

  const scaleColor = useRef(
    scaleSymlog<string, string>()
      .range(["rgba(80, 105, 180, 0.75)", "rgba(240, 105, 180, 0.75)"])
      .clamp(true)
  );

  useEffect(() => {
    const degree = cosmograph?.current?.getNodeDegrees();
    if (degree) {
      scaleColor.current.domain([Math.min(...degree), Math.max(...degree)]);
      setDegree(degree);
    }
  }, [degree]);

  const nodeColor = useCallback(
    (n: Node, index: number) => {
      if (index === undefined) return null;
      else {
        const degreeValue = degree[index];
        if (degreeValue === undefined) return null;
        else return scaleColor.current?.(degreeValue);
      }
    },
    [degree]
  );

  const [showLabelsFor, setShowLabelsFor] = useState<Node[] | undefined>(
    undefined
  );
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();

  const onCosmographClick = useCallback<
    Exclude<CosmographInputConfig<Node, Link>["onClick"], undefined>
  >((n) => {
    search?.current?.clearInput();
    if (n) {
      cosmograph.current?.selectNode(n, true);
      setShowLabelsFor([n]);
      setSelectedNode(n);
    } else {
      cosmograph.current?.unselectNodes();
      setShowLabelsFor(undefined);
      setSelectedNode(undefined);
    }
  }, []);

  const onSearchSelectResult = useCallback<
    Exclude<CosmographSearchInputConfig<Node>["onSelectResult"], undefined>
  >((n) => {
    setShowLabelsFor(n ? [n] : undefined);
    setSelectedNode(n);
  }, []);

  return (
    <div className="wrapper">
      <CosmographProvider nodes={nodes} links={links}>
        <CosmographSearch
          ref={search}
          className="searchStyle"
          onSelectResult={onSearchSelectResult}
          maxVisibleItems={20}
        />
        <Cosmograph
          ref={cosmograph}
          className="cosmographStyle"
          showTopLabels
          showLabelsFor={showLabelsFor}
          nodeLabelColor={"white"}
          hoveredNodeLabelColor={"white"}
          nodeSize={(n) => n.size ?? null}
          nodeColor={nodeColor}
          linkWidth={(l: Link) => l.width ?? null}
          linkColor={(l: Link) => l.color ?? null}
          curvedLinks
          onClick={onCosmographClick}
        />
        <div className="sidebarStyle">
          {selectedNode ? (
            <div className="infoStyle">
              {`id: ${selectedNode?.id}
            value: ${selectedNode?.value}`}
            </div>
          ) : (
            <></>
          )}
          <div className="histogramWrapper">
            <CosmographHistogram
              className="histogramStyle"
              ref={histogram}
              barCount={100}
            />
          </div>
        </div>
        <CosmographTimeline
          className="timelineStyle"
          ref={timeline}
          showAnimationControls
        />
      </CosmographProvider>
    </div>
  );
}
