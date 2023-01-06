import React from "react";
class CodeInput extends React.Component {
    render = () => (
        <div className={`code-input`}>
            {Array.from(Array(this.props.size).keys()).map((a, i) => (
                <input
                    key={i}
                    maxLength={1}
                    type={this.props.type}
                    onPaste={(e) => {
                        let paste = e.clipboardData.getData("text");
                        if (paste.length > this.props.size) {
                            paste = paste.substring(0, this.props.size);
                        }
                        this.props.onChange(paste);
                        this[`input-${i}`].blur();
                    }}
                    name={this.props.name}
                    className={`box-input`}
                    ref={(e) => (this[`input-${i}`] = e)}
                    onChange={(e) => {
                        let full = this.props.value.split("");
                        full[i] = e.target.value;
                        if (e.target.value === "" && i > 0) {
                            this[`input-${i - 1}`].select();
                        } else if (
                            e.target.value !== "" &&
                            i < this.props.size - 1
                        ) {
                            this[`input-${i + 1}`].select();
                        } else if (i === this.props.size - 1) {
                            this[`input-${i}`].blur();
                        }
                        this.props.onChange(full.join(""));
                    }}
                    onBlur={this.props.onBlur}
                    value={this.props.value[i] ? this.props.value[i] : ""}
                />
            ))}
        </div>
    );
}
export default CodeInput;
