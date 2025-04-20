// import React, { useState, useRef, useEffect } from "react";
// import { chatWithAI } from "../services/chatbot.service";
// import { MessageSquare, X, Send } from "lucide-react";
// import {
//   Button,
//   Input,
//   Card,
//   Avatar,
//   Space,
//   FloatButton,
//   message,
//   Typography,
// } from "antd";
// import { UserOutlined, RobotOutlined } from "@ant-design/icons";
// import { motion, AnimatePresence } from "framer-motion";

// const { Text } = Typography;

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = input.trim();
//     setInput("");
//     setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
//     setIsLoading(true);

//     try {
//       const response = await chatWithAI(userMessage);
//       setMessages((prev) => [
//         ...prev,
//         { text: response.response, isUser: false },
//       ]);
//     } catch (error) {
//       message.error("Sorry, I encountered an error. Please try again.");
//       setMessages((prev) => [
//         ...prev,
//         {
//           text: "Sorry, I encountered an error. Please try again.",
//           isUser: false,
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) {
//     return (
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         <FloatButton
//           icon={<MessageSquare />}
//           type="primary"
//           onClick={() => setIsOpen(true)}
//           style={{ right: 24, bottom: 24 }}
//           tooltip="Chat with Assistant"
//         />
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.8 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card
//         className="fixed bottom-4 right-4 w-96 shadow-lg"
//         style={{
//           borderRadius: "12px",
//           border: "none",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//         }}
//         title={
//           <div className="flex justify-between items-center">
//             <Space>
//               <Avatar
//                 icon={<RobotOutlined />}
//                 style={{ backgroundColor: "#1890ff" }}
//               />
//               <Text strong>Smart Home Assistant</Text>
//             </Space>
//             <Button
//               type="text"
//               icon={<X size={16} />}
//               onClick={() => setIsOpen(false)}
//               style={{ color: "#666" }}
//             />
//           </div>
//         }
//         bodyStyle={{ padding: 0 }}
//       >
//         <div
//           className="h-96 overflow-y-auto p-4"
//           style={{
//             background: "linear-gradient(to bottom, #f5f7fa, #ffffff)",
//             scrollbarWidth: "thin",
//             scrollbarColor: "#1890ff #f5f7fa",
//           }}
//         >
//           <AnimatePresence>
//             {messages.map((message, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className={`mb-4 flex ${
//                   message.isUser ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <Space
//                   className={`p-3 rounded-lg ${
//                     message.isUser
//                       ? "bg-blue-500 text-white"
//                       : "bg-white text-gray-800"
//                   } max-w-[80%]`}
//                   style={{
//                     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                   }}
//                 >
//                   {message.isUser ? (
//                     <Avatar
//                       icon={<UserOutlined />}
//                       style={{
//                         backgroundColor: "#1890ff",
//                       }}
//                     />
//                   ) : (
//                     <Avatar
//                       icon={<RobotOutlined />}
//                       style={{
//                         backgroundColor: "#52c41a",
//                       }}
//                     />
//                   )}
//                   <Text
//                     style={{
//                       color: message.isUser ? "white" : "inherit",
//                     }}
//                   >
//                     {message.text}
//                   </Text>
//                 </Space>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//           {isLoading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="flex justify-start mb-4"
//             >
//               <Space className="bg-white p-3 rounded-lg shadow-sm">
//                 <Avatar
//                   icon={<RobotOutlined />}
//                   style={{ backgroundColor: "#52c41a" }}
//                 />
//                 <div className="flex space-x-2">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
//                 </div>
//               </Space>
//             </motion.div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//         <form onSubmit={handleSubmit} className="p-4 border-t">
//           <Space.Compact className="w-full">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               size="large"
//               style={{ borderRadius: "8px 0 0 8px" }}
//             />
//             <Button
//               type="primary"
//               htmlType="submit"
//               icon={<Send size={16} />}
//               loading={isLoading}
//               size="large"
//               style={{ borderRadius: "0 8px 8px 0" }}
//             />
//           </Space.Compact>
//         </form>
//       </Card>
//     </motion.div>
//   );
// };

// export default Chatbot;
