import React, { useState } from 'react';
import Draggable from 'react-draggable';
import {ChatDrawer} from '../components/ChatDrawer';

function ConspiracyBoard() {
    // State for board nodes
    const [nodes, setNodes] = useState([
        { id: 'AdamSticky', x: 100, y: 100, unlocked: true, label: 'Adam', question: null },
        { id: 'LearningLoop', x: 300, y: 200, unlocked: false, label: 'Learning Loop', question: null },
        // Add other nodes here
    ]);

    const [activeNode, setActiveNode] = useState(null); // Currently selected node
    const [chatMessages, setChatMessages] = useState([]); // Chat log

    // Handle clicking a node
    const handleNodeClick = (node) => {
        if (!node.unlocked) return; // Ignore locked nodes
        setActiveNode(node);

        // Add logic to show a question or puzzle when node is clicked
        if (!node.question) {
            // Simulate generating a question
            const newQuestion = `Solve this puzzle for ${node.label}`;
            setNodes((prev) =>
                prev.map((n) =>
                    n.id === node.id ? { ...n, question: newQuestion } : n
                )
            );
        }
    };

    // Unlock a new node after solving a puzzle
    const unlockNode = (nodeId) => {
        setNodes((prev) =>
            prev.map((node) =>
                node.id === nodeId ? { ...node, unlocked: true } : node
            )
        );
    };

    // Add a message to the chat
    const addChatMessage = (sender, message) => {
        setChatMessages((prev) => [...prev, `[${sender}]: ${message}`]);
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#1e1e2e' }}>
            {/* Render the nodes */}
            {nodes.map((node) => (
                <Draggable
                    key={node.id}
                    defaultPosition={{ x: node.x, y: node.y }}
                    onStop={(e, data) => {
                        // Update node position on drag end
                        setNodes((prev) =>
                            prev.map((n) =>
                                n.id === node.id
                                    ? { ...n, x: data.x, y: data.y }
                                    : n
                            )
                        );
                    }}
                >
                    <div
                        onClick={() => handleNodeClick(node)}
                        style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: node.unlocked ? '#ffff99' : '#555',
                            border: '2px solid black',
                            borderRadius: '8px',
                            textAlign: 'center',
                            lineHeight: '100px',
                            cursor: node.unlocked ? 'pointer' : 'default',
                        }}
                    >
                        {node.label}
                    </div>
                </Draggable>
            ))}

            {/* Display the active node's puzzle */}
            {activeNode && activeNode.question && (
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#ffff99',
                        padding: '20px',
                        border: '2px solid black',
                        borderRadius: '10px',
                        width: '400px',
                    }}
                >
                    <h3>{activeNode.question}</h3>
                    <button
                        onClick={() => {
                            unlockNode('LearningLoop');
                            addChatMessage('Alice', 'Well done! Learning Loop unlocked.');
                            setActiveNode(null);
                        }}
                    >
                        Solve and Unlock Learning Loop
                    </button>
                </div>
            )}

            {/* Chat Drawer */}
            {/* <ChatDrawer messages={chatMessages} /> */}
        </div>
    );
}

export default ConspiracyBoard;
