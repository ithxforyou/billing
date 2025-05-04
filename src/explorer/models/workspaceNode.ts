import * as vscode from "vscode";

import { NodeBase, NodeOptions } from "./nodeBase";
import { RootNode } from "./rootNode";
import { workspaceState } from "../../extension";

export class WorkspaceNode extends NodeBase {
  public eventEmitter: vscode.EventEmitter<NodeBase>;
  public uniqueId: string;
  public constructor(label: string, eventEmitter: vscode.EventEmitter<NodeBase>, options: NodeOptions) {
    super(label, label, options);
    this.uniqueId = `serverNode:${this.namespace}:${this.extraNode ? ":extra:" : ""}`;
    this.options.generated = workspaceState.get(`ExplorerGenerated:${this.uniqueId}`);
    this.options.system = workspaceState.get(`ExplorerSystem:${this.uniqueId}`);
    this.eventEmitter = eventEmitter;
  }

  public getTreeItem(): vscode.TreeItem {
    const flags = [];
    this.options.generated && flags.push(":generated:");
    this.options.system && flags.push(":system:");
    const { host, port, docker, dockerService } = this.conn;
    const serverInfo = docker
      ? "docker" + (dockerService ? `:${dockerService}:${port}` : "")
      : `${host}${port ? ":" + port : ""}`;
    const connInfo = this.extraNode
      ? `[${this.namespace}] on ${serverInfo}`
      : `${this.label} (${serverInfo}[${this.namespace}])`;
    return {
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
      contextValue: `${this.uniqueId}${flags.join("")}`,
      label: connInfo,
      iconPath: new vscode.ThemeIcon(this.extraNode ? "database" : "server-environment"),
    };
  }

  public async getChildren(_element: NodeBase): Promise<NodeBase[]> {
    const children = [];
    let node: RootNode;

    node = new RootNode(
      "Classes",
      "",
      "dataRootNode:classesRootNode",
      "CLS",
      this.options,
      false,
      new vscode.ThemeIcon("symbol-class")
    );
    children.push(node);

    node = new RootNode(
      "Routines",
      "",
      "dataRootNode:routinesRootNode",
      "RTN",
      this.options,
      false,
      new vscode.ThemeIcon("note")
    );
    children.push(node);

    node = new RootNode(
      "Includes",
      "",
      "dataRootNode:routinesRootNode",
      "INC",
      this.options,
      false,
      new vscode.ThemeIcon("file-symlink-file")
    );
    children.push(node);

    node = new RootNode(
      "CSP Files",
      "",
      "dataRootNode:cspRootNode",
      "CSP",
      this.options,
      false,
      new vscode.ThemeIcon("symbol-file")
    );
    children.push(node);

    node = new RootNode(
      "Other",
      "",
      "dataRootNode:otherRootNode",
      "OTH",
      this.options,
      false,
      new vscode.ThemeIcon("symbol-misc")
    );
    children.push(node);

    return children;
  }
}
