// gryphon output: main.kt

import Foundation

public typealias ResultMap = [String: Any?]

extension ResultMap {
    private var arrayRegex: String {
        "\\[[0-9]+\\]$"
    }

    private func getArrayValue(_ path: String) -> Any? {
        if path.range(of: ".*\(arrayRegex)", options: .regularExpression) != nil,
            let rangeOfIndex = path.range(of: arrayRegex, options: .regularExpression)
        {
            let index = String(path[rangeOfIndex].dropFirst().dropLast())

            let pathWithoutIndex = String(path.replacingCharacters(in: rangeOfIndex, with: ""))

            let resultMap = self[pathWithoutIndex] as? [Any]

            if let intIndex = Int(index), resultMap?.indices.contains(intIndex) ?? false {
                return resultMap?[intIndex]
            }
        }

        return nil
    }

    func deepFind(_ path: String) -> Any? {
        let splittedPath = path.split(separator: ".")

        if splittedPath.count > 1 {
            if let firstPath = splittedPath.first,
                let range = Range(
                    NSRange(
                        location: firstPath.startIndex.utf16Offset(in: path),
                        length: firstPath.endIndex.utf16Offset(in: path)
                    ),
                    in: path
                )
            {
                let nextPath = String(path.replacingCharacters(in: range, with: "").dropFirst())

                if let arrayValue = getArrayValue(String(firstPath)) {
                    return (arrayValue as? ResultMap)?.deepFind(nextPath)
                }

                let resultMap = self[String(firstPath)] as? ResultMap
                return resultMap?
                    .deepFind(nextPath)
            }

            return nil
        }

        return getArrayValue(path) ?? self[path] ?? nil
    }

    func getValue(at path: String) -> Any? {
        return deepFind(path)
    }
}