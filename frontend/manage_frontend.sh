#!/bin/bash

# 前端服务管理脚本

FRONTEND_DIR="/home/aily/Desktop/Demo/frontend"
PID_FILE="$FRONTEND_DIR/frontend.pid"
LOG_FILE="$FRONTEND_DIR/frontend.log"

case "$1" in
    start)
        echo "🚀 启动前端服务..."
        cd "$FRONTEND_DIR"
        
        # 检查服务是否已在运行
        if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
            echo "⚠️  服务已在运行 (PID: $(cat "$PID_FILE"))"
            exit 1
        fi
        
        # 从环境变量获取端口，默认为3000
        local port=${VITE_PORT:-3000}
        local host=${VITE_DEV_SERVER_HOST:-localhost}
        
        echo "📊 配置信息:"
        echo "  - 端口: $port"
        echo "  - 主机: $host"
        echo "  - 环境变量文件:"
        ls -la .env* 2>/dev/null || echo "    无环境变量文件"
        
        # 启动服务
        nohup npm run dev > "$LOG_FILE" 2>&1 &
        echo $! > "$PID_FILE"
        
        echo "✅ 服务已启动 (PID: $(cat "$PID_FILE"))"
        echo "📁 日志文件: $LOG_FILE"
        echo "🌐 访问地址: http://$host:$port"
        ;;
    stop)
        echo "🛑 停止前端服务..."
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ps -p "$PID" > /dev/null 2>&1; then
                kill "$PID"
                echo "✅ 已停止服务 (PID: $PID)"
                rm -f "$PID_FILE"
            else
                echo "⚠️  服务未运行"
                rm -f "$PID_FILE"
            fi
        else
            echo "⚠️  PID文件不存在，尝试停止相关进程..."
            pkill -f "vite" 2>/dev/null && echo "✅ 已停止Vite进程" || echo "❌ 未找到Vite进程"
        fi
        ;;
    status)
        echo "📊 前端服务状态:"
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ps -p "$PID" > /dev/null 2>&1; then
                # 尝试从日志中提取端口信息
                local port=$(grep -o "Local:[[:space:]]*http://[^:]*:\?\([0-9]*\)" "$LOG_FILE" 2>/dev/null | tail -1 | sed 's/.*://' || echo "3000")
                local host=$(grep -o "Local:[[:space:]]*http://\([^:/]*\)" "$LOG_FILE" 2>/dev/null | tail -1 | sed 's/.*http:\/\///' || echo "localhost")
                
                echo "✅ 运行中 (PID: $PID)"
                echo "📁 日志文件: $LOG_FILE"
                echo "🌐 访问地址: http://$host:$port"
                echo "📝 最近日志:"
                tail -5 "$LOG_FILE" 2>/dev/null || echo "  无日志"
            else
                echo "❌ 已停止 (PID文件存在但进程不存在)"
                rm -f "$PID_FILE"
            fi
        else
            echo "❌ 未运行"
        fi
        ;;
    restart)
        echo "🔄 重启前端服务..."
        $0 stop
        sleep 2
        $0 start
        ;;
    logs)
        echo "📝 查看服务日志:"
        if [ -f "$LOG_FILE" ]; then
            tail -f "$LOG_FILE"
        else
            echo "❌ 日志文件不存在"
        fi
        ;;
    install)
        echo "📦 安装前端依赖..."
        cd "$FRONTEND_DIR"
        npm install
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status|logs|install}"
        echo "  start   启动前端服务"
        echo "  stop    停止前端服务"
        echo "  restart 重启前端服务"
        echo "  status  查看服务状态"
        echo "  logs    查看实时日志"
        echo "  install 安装依赖"
        exit 1
        ;;
esac