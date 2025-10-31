import { useState } from 'react';
import { Send, Bell, MessageSquare, AlertCircle, CheckCircle2, Clock, Package, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
  color: string;
  bg: string;
}

interface Message {
  id: string;
  subject: string;
  preview: string;
  status: string;
  time: string;
  unread: boolean;
}

export function Support() {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('notifications');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageBody, setNewMessageBody] = useState('');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD-1240 has been placed. Please review and accept.',
      time: '5 minutes ago',
      read: false,
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      id: '2',
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Fresh Broccoli is running low. Current stock: 8 units.',
      time: '1 hour ago',
      read: false,
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹2,850 has been credited to your account.',
      time: '2 hours ago',
      read: true,
      icon: CheckCircle2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: '4',
      type: 'order',
      title: 'Order Delivered',
      message: 'Order #ORD-1236 has been successfully delivered.',
      time: '3 hours ago',
      read: true,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      id: '5',
      type: 'inventory',
      title: 'Stock Update Required',
      message: 'Organic Tomatoes inventory needs to be updated.',
      time: '5 hours ago',
      read: true,
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      subject: 'Payment Settlement Inquiry',
      preview: 'Hello, I wanted to check on the payment settlement timeline...',
      status: 'open',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      subject: 'Product Listing Assistance',
      preview: 'I need help updating my product images and descriptions...',
      status: 'answered',
      time: '1 day ago',
      unread: false,
    },
    {
      id: '3',
      subject: 'Delivery Zone Expansion',
      preview: 'Can I add more delivery zones to my account?',
      status: 'answered',
      time: '2 days ago',
      unread: false,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleMessageClick = (id: string) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, unread: false } : m
    ));
  };

  const handleSendMessage = () => {
    if (!newMessageSubject.trim() || !newMessageBody.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      subject: newMessageSubject,
      preview: newMessageBody.substring(0, 50) + '...',
      status: 'open',
      time: 'Just now',
      unread: false,
    };

    setMessages([newMessage, ...messages]);
    setNewMessageSubject('');
    setNewMessageBody('');
    toast.success('Message sent successfully! We\'ll respond within 2 hours.');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Support & Notifications</h1>
        <p className="text-gray-600">Get help and stay updated with important alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'notifications'
                      ? 'border-b-2 border-green-600 text-green-700 bg-green-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <Badge className="bg-green-600 text-white hover:bg-green-600">
                      {unreadNotifications}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'messages'
                      ? 'border-b-2 border-green-600 text-green-700 bg-green-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Messages
                  {unreadMessages > 0 && (
                    <Badge className="bg-green-600 text-white hover:bg-green-600">
                      {unreadMessages}
                    </Badge>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Notifications</CardTitle>
                  {unreadNotifications > 0 && (
                    <Button 
                      variant="ghost" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                            notification.read
                              ? 'bg-white border-gray-200 hover:bg-gray-50'
                              : 'bg-green-50 border-green-200 hover:bg-green-100'
                          }`}
                          onClick={() => handleMarkNotificationAsRead(notification.id)}
                        >
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                          <div className="flex items-start gap-4">
                            <div className={`${notification.bg} p-3 rounded-xl`}>
                              <Icon className={`w-5 h-5 ${notification.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <p className="text-gray-900">{notification.title}</p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-green-600 rounded-full ml-2 mt-1"></div>
                                )}
                              </div>
                              <p className="text-gray-600 mb-2">{notification.message}</p>
                              <div className="flex items-center gap-2 text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Support Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No messages yet. Send your first message below!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          message.unread
                            ? 'bg-green-50 border-green-200 hover:bg-green-100'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleMessageClick(message.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <p className="text-gray-900">{message.subject}</p>
                            {message.unread && (
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            )}
                          </div>
                          <Badge
                            className={
                              message.status === 'open'
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                : 'bg-green-100 text-green-700 hover:bg-green-100'
                            }
                          >
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{message.preview}</p>
                        <p className="text-gray-500">{message.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* New Message */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-700">Subject</label>
                <Input 
                  placeholder="Enter subject" 
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700">Message</label>
                <Textarea
                  placeholder="Describe your issue or question..."
                  rows={6}
                  value={newMessageBody}
                  onChange={(e) => setNewMessageBody(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 gap-2"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => toast.success('Opening help article...')}
                className="block w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-gray-900 mb-1">How to add products?</p>
                <p className="text-gray-600">Step-by-step guide</p>
              </button>
              <button
                onClick={() => toast.success('Opening help article...')}
                className="block w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-gray-900 mb-1">Payment settlement</p>
                <p className="text-gray-600">Understanding payments</p>
              </button>
              <button
                onClick={() => toast.success('Opening help article...')}
                className="block w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-gray-900 mb-1">Order fulfillment</p>
                <p className="text-gray-600">Managing orders</p>
              </button>
              <button
                onClick={() => toast.success('Opening help article...')}
                className="block w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-gray-900 mb-1">Inventory tracking</p>
                <p className="text-gray-600">Stock management tips</p>
              </button>
            </CardContent>
          </Card>

          {/* Support Hours */}
          <Card className="border-gray-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900">Support Hours</p>
                  <p className="text-gray-600">Mon - Sat</p>
                </div>
              </div>
              <p className="text-gray-700 mb-2">9:00 AM - 6:00 PM IST</p>
              <p className="text-gray-600">We typically respond within 2 hours</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
